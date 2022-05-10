export interface ContainerOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export enum CodeLanguage {
  JAVASCRIPT = 'JAVASCRIPT',
}
