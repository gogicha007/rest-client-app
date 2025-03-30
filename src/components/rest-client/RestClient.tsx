import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import MethodSelector from './MethodSelector';
import UrlInput from './UrlInput';
import HeadersEditor from './HeadersEditor';
import RequestBodyEditor from './RequestBodyEditor';
import ResponseSection from './ResponseSection';
import CodeGenerator from './CodeGenerator';
import { RequestData } from '../../types/request';
import s from './RestClient.module.scss';

const RestClient: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [requestData, setRequestData] = useState<RequestData>({
    method: (params?.method as string) || 'GET',
    url: '',
    headers: {},
    body: '',
  });

  // Здесь происходит восстановление значений по URL адресу из base64 формата
  useEffect(() => {
    // Восстанавливаем состояние URL
    const encodedUrl = searchParams.get('url');
    if (encodedUrl) {
      try {
        const decodedUrl = atob(encodedUrl);
        setRequestData((prev) => ({ ...prev, url: decodedUrl }));
      } catch (error) {
        console.error('Error decoding URL:', error);
      }
    }

    // Восстанавливаем состояние тела запроса (json)
    const encodedBody = searchParams.get('body');
    if (encodedBody) {
      try {
        const decodedBody = atob(encodedBody);
        setRequestData((prev) => ({ ...prev, body: decodedBody }));
      } catch (error) {
        console.error('Error decoding body:', error);
      }
    }

    // Восстанавливаем состояние заголовков запроса
    const headers: Record<string, string> = {};
    searchParams.forEach((value: string, key: string) => {
      if (key !== 'url' && key !== 'body') {
        headers[key] = value;
      }
    });
    if (Object.keys(headers).length > 0) {
      setRequestData((prev) => ({ ...prev, headers }));
    }
  }, [searchParams]);

  // Изменяем URL адресс в зависимости от значений, подставляя их в качестве base64
  const handleRequestDataChange = (newData: Partial<RequestData>) => {
    const updatedData = { ...requestData, ...newData };
    setRequestData(updatedData);

    const params = new URLSearchParams();
    if (updatedData.url) {
      params.set('url', btoa(updatedData.url));
    }
    if (updatedData.body) {
      params.set('body', btoa(updatedData.body));
    }
    Object.entries(updatedData.headers).forEach(([key, value]) => {
      params.set(key, value);
    });
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  return (
    <div className={s.restCclient}>
      <div className={s.requestSection}>
        <div className={s.methodUrlRow}>
          <MethodSelector
            value={requestData.method}
            onChange={(method: string) => handleRequestDataChange({ method })}
          />
          <UrlInput
            value={requestData.url}
            onChange={(url: string) => handleRequestDataChange({ url })}
          />
        </div>
        <HeadersEditor
          headers={requestData.headers}
          onChange={(headers: Record<string, string>) =>
            handleRequestDataChange({ headers })
          }
        />
        <RequestBodyEditor
          value={requestData.body}
          onChange={(body: string) => handleRequestDataChange({ body })}
        />
        <CodeGenerator requestData={requestData} />
      </div>
      <ResponseSection requestData={requestData} />
    </div>
  );
};

export default RestClient;
