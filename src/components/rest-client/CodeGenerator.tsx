import React, { useState, useEffect, useCallback } from 'react';
import { RequestData } from '../../types/request';
import * as codegen from 'postman-code-generators';
import { Request } from 'postman-collection';
import s from './RestClient.module.scss';

interface CodeGeneratorProps {
  requestData: RequestData;
}

interface ISelectedLanguage {
  option: string;
  language: string;
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ requestData }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<ISelectedLanguage>({
    option: 'C# - HttpClient',
    language: 'csharp',
  });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [languageOptions, setLanguageOptions] = useState<
    Array<{ option: string; language: string }>
  >([]);

  useEffect(() => {
    // Get available languages and variants
    const options = codegen
      .getLanguageList()
      .reduce(
        (acc: Array<{ option: string; language: string }>, curLanguage) => {
          curLanguage.variants.forEach((variant) => {
            acc.push({
              option: `${curLanguage.label} - ${variant.key}`,
              language: curLanguage.key,
            });
          });
          return acc;
        },
        []
      );

    setLanguageOptions(options);
  }, []);

  const generateCode = useCallback(() => {
    if (!requestData.url) {
      setGeneratedCode('Please enter a URL to generate code');
      return;
    }

    const request = new Request({
      method: requestData.method,
      url: requestData.url,
      header: Object.entries(requestData.headers).map(([key, value]) => ({
        key,
        value,
      })),
      body: requestData.body
        ? {
            mode: 'raw',
            raw: requestData.body,
          }
        : undefined,
    });

    const convertOptions: codegen.ConvertOptions = {
      indentType: 'Space',
      indentCount: 2,
      requestTimeout: 0,
      trimRequestBody: true,
      addCacheHeader: false,
      followRedirect: true,
    };

    codegen.convert(
      selectedLanguage.language,
      selectedLanguage.option.split('- ')[1],
      request,
      convertOptions,
      (error: Error | null, snippet: string) => {
        if (error) {
          console.error('Error generating code:', error);
          setGeneratedCode('Error generating code. Please try again.');
        } else {
          setGeneratedCode(snippet);
        }
      }
    );
  }, [selectedLanguage, requestData]);

  useEffect(() => {
    generateCode();
  }, [generateCode]);

  return (
    <div className={s.codeGenerator}>
      <div className={s.codeGeneratorHeader}>
        <h3>Generated Code</h3>
        <select
          value={selectedLanguage.option}
          onChange={(e) => {
            const currentOption = languageOptions.find(
              (option) => option.option === e.target.value
            );
            if (!currentOption) return;
            setSelectedLanguage({
              option: e.target.value,
              language: currentOption.language,
            });
          }}
          className={s.languageSelector}
        >
          {languageOptions.map((option) => (
            <option key={option.option} value={option.option}>
              {option.option}
            </option>
          ))}
        </select>
      </div>
      <pre className={s.generatedCode}>{generatedCode}</pre>
    </div>
  );
};

export default CodeGenerator;
