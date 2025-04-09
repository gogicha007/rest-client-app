'use client';

import React, { useState } from 'react';
import { RequestData, ResponseData } from '../../types/request';
import s from './RestClient.module.scss';
import { saveRequestData } from '@/utils/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectVariables } from '@/store/variablesSlice';
import {
  replaceTemplateVariables,
  replaceVariablesInObject,
} from '@/utils/utils';

interface ResponseSectionProps {
  requestData: RequestData;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({ requestData }) => {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentPath = usePathname();
  const queryParams = useSearchParams();
  const variables = useAppSelector(selectVariables);

  const sendRequest = async () => {
    console.log('request >', requestData);
    console.log('variables >', variables);

    if (!requestData.url) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let bodyToSend;

      try {
        const jsonData = JSON.parse(requestData.body);
        bodyToSend = JSON.stringify(
          replaceVariablesInObject(jsonData, variables),
          null,
          2
        );
      } catch {
        bodyToSend = replaceTemplateVariables(requestData.body, variables);
      }

      const response = await fetch(
        replaceTemplateVariables(requestData.url, variables),
        {
          method: requestData.method,
          headers: replaceVariablesInObject(requestData.headers, variables),
          body:
            requestData.method !== 'GET' && requestData.body
              ? bodyToSend
              : undefined,
        }
      );

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const body = await response.text();
      let parsedBody = body;

      try {
        const jsonData = JSON.parse(body);
        parsedBody = JSON.stringify(jsonData, null, 2);
      } catch {
        parsedBody = body;
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers,
        body: parsedBody,
      });

      // Save request data to Firebase
      const auth = getAuth();
      const user = auth.currentUser;
      const url = `${currentPath}?${queryParams}`;
      if (user) {
        await saveRequestData(user.uid, { ...requestData, link: url });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s.responseSection}>
      <div className={s.responseHeader}>
        <h3>Response</h3>
        <button
          onClick={sendRequest}
          disabled={isLoading}
          className={`button ${s.sendRequestBtn}`}
        >
          {isLoading ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      {error && <div className={s.errorMessage}>{error}</div>}

      {response && (
        <>
          <div className={s.responseStatus}>
            <span
              className={`${s.statusCode} ${response.status >= 400 ? s.error : s.success}`}
            >
              {response.status} {response.statusText}
            </span>
          </div>
          <div className={s.responseHeaders}>
            <h4>Headers</h4>
            <pre>{JSON.stringify(response.headers, null, 2)}</pre>
          </div>
          <div className={s.responseBody}>
            <h4>Body</h4>
            <pre>{response.body}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default ResponseSection;
