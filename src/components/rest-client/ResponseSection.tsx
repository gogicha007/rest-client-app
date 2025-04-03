import React, { useState } from 'react';
import { RequestData, ResponseData } from '../../types/request';
import s from './RestClient.module.scss';
import { saveRequestData } from '@/utils/firebaseConfig';
import { getAuth } from 'firebase/auth';

interface ResponseSectionProps {
  requestData: RequestData;
}

const ResponseSection: React.FC<ResponseSectionProps> = ({ requestData }) => {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async () => {
    if (!requestData.url) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body:
          requestData.method !== 'GET' && requestData.body
            ? requestData.body
            : undefined,
      });

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const body = await response.text();
      let parsedBody = body;
      try {
        parsedBody = JSON.stringify(JSON.parse(body), null, 2);
      } catch {
        // Todo: обработать некорректный ответ от сервера
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
      if (user) {
        await saveRequestData(user.uid, requestData);
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
          className={s.sendRequestBtn}
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
