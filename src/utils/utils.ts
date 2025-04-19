import { Variable } from '../store/variablesSlice';

export const replaceTemplateVariables = (
  str: string,
  variables: Variable[]
): string => {
  const regex = /\{\{(\w+)\}\}/g;
  const res = str;

  return res.replace(regex, (match, key) => {
    const foundVar = variables.find((v) => v.key === key);
    return foundVar ? foundVar.value : match;
  });
};

export const replaceVariablesInObject = (
  obj: Record<string, string>,
  variables: Variable[]
) => {
  const replacedObject: Record<string, string> = {};
  for (const prop in obj) {
    replacedObject[replaceTemplateVariables(prop, variables)] =
      replaceTemplateVariables(obj[prop], variables);
  }
  return replacedObject;
};
