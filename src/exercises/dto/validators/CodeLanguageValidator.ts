import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CodeLanguage } from 'src/run/run.types';

@ValidatorConstraint({ name: 'customText', async: false })
export class CodeLanguageValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return Object.keys(CodeLanguage).includes(text);
  }

  defaultMessage() {
    return '$value is not a valid code language!';
  }
}
