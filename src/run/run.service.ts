import { Injectable } from '@nestjs/common';
import * as Docker from 'dockerode';
import { Stream } from 'stream';
import { ContainerOutput, CodeLanguage } from './run.types';

interface ContainerStrategy {
  image: string;
  commands: string[];
}

const containerStrategies: Map<CodeLanguage, ContainerStrategy> = new Map([
  [
    CodeLanguage.JAVASCRIPT,
    {
      image: 'node:18',
      commands: ['echo $SOURCE_CODE > main.js', 'node main.js $ARGUMENTS'],
    },
  ],
]);

const docker = new Docker();

@Injectable()
export class RunService {
  async run(
    codeLanguage: CodeLanguage,
    code: string,
    args: string,
  ): Promise<ContainerOutput> {
    const containerStrategy = containerStrategies.get(codeLanguage);

    if (!containerStrategy) {
      throw new Error(`Unsupported container type: ${codeLanguage}`);
    }

    await this.pullImage(containerStrategy.image);

    let container: Docker.Container;
    const stdoutStream = new Stream.PassThrough();
    const stderrStream = new Stream.PassThrough();

    try {
      [, container] = await docker.run(
        containerStrategy.image,
        ['sh', '-c', containerStrategy.commands.join('; ')],
        [stdoutStream, stderrStream],
        {
          Tty: false,
          Env: [`SOURCE_CODE=${code}`, `ARGUMENTS=${args}`],
        },
      );
    } finally {
      container.remove({ force: true });
    }

    return {
      stdout: stdoutStream.read()?.toString(),
      stderr: stderrStream.read()?.toString(),
      exitCode: 0,
    };
  }

  async pullImage(image: string): Promise<void> {
    return new Promise(async (resolve) => {
      if (
        !(await docker.listImages()).find((img: any) =>
          img.RepoTags?.includes(image),
        )
      ) {
        console.log(`Downloading image ${image}...`);

        const stream = await docker.pull(image);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        stream.on('data', (_data: { toString: () => any }) => {
          // console.log(_data.toString());
        });

        stream.on('end', () => {
          console.log('Image downloaded');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
