/* Типизируем библиотеку @postman-code-generators под TypeScript */
declare module 'postman-code-generators' {
  import { Request } from 'postman-collection';

  export interface ConvertOptions {
    indentType?: 'Space' | 'Tab';
    indentCount?: number;
    requestTimeout?: number;
    trimRequestBody?: boolean;
    addCacheHeader?: boolean;
    followRedirect?: boolean;
  }

  interface LanguageVariant {
    key: string;
  }

  interface Language {
    key: string;
    label: string;
    syntax_mode: string;
    variants: LanguageVariant[];
  }

  interface CodeGenerator {
    convert(
      language: string,
      variant: string,
      request: Request,
      options: ConvertOptions,
      callback: (error: Error | null, snippet: string) => void
    ): void;
    getOptions(
      language: string,
      variant: string,
      callback: (error: Error | null, options: unknown) => void
    ): void;
    getLanguageList(): Language[];
  }

  const codegen: CodeGenerator;
  export = codegen;
}
