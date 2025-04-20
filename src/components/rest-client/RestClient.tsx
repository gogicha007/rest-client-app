'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import MethodSelector from './MethodSelector';
import UrlInput from './UrlInput';
import HeadersEditor from './HeadersEditor';
import RequestBodyEditor from './RequestBodyEditor';
import ResponseSection from './ResponseSection';
import CodeGenerator from './CodeGenerator';
import { RequestData } from '../../types/request';
import s from './RestClient.module.scss';

const RestClient: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const methodFromPath = pathname.split('/').pop()?.toUpperCase() || 'GET';

  const [requestData, setRequestData] = useState<RequestData>({
    method: methodFromPath,
    url: '',
    headers: {},
    body: '',
  });

  useEffect(() => {
    if (requestData.method && requestData.method !== methodFromPath) {
      const currentParams = new URLSearchParams(searchParams.toString());
      router.push(
        `/rest-client/${requestData.method.toLowerCase()}?${currentParams.toString()}`
      );
    }
  }, [requestData.method, methodFromPath, router, searchParams]);

  useEffect(() => {
    const encodedUrl = searchParams.get('url');
    if (encodedUrl) {
      try {
        const decodedUrl = atob(encodedUrl);
        setRequestData((prev) => ({ ...prev, url: decodedUrl }));
      } catch (error) {
        console.error('Error decoding URL:', error);
      }
    }

    const encodedBody = searchParams.get('body');
    if (encodedBody) {
      try {
        const decodedBody = atob(encodedBody);
        setRequestData((prev) => ({ ...prev, body: decodedBody }));
      } catch (error) {
        console.error('Error decoding body:', error);
      }
    }

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

  const handleRequestDataChange = (newData: Partial<RequestData>) => {
    const updatedData = { ...requestData, ...newData };
    setRequestData(updatedData);

    const params = new URLSearchParams(searchParams.toString());
    
    // Only clear and reset headers if the headers property was changed
    if (newData.headers) {
      // Clear all existing headers from params
      searchParams.forEach((_, key) => {
        if (key !== 'url' && key !== 'body') {
          params.delete(key);
        }
      });
      
      // Add all current headers
      Object.entries(updatedData.headers).forEach(([key, value]) => {
        params.set(key, value);
      });
    }
    
    if (updatedData.url) {
      params.set('url', btoa(updatedData.url));
    }
    if (updatedData.body) {
      params.set('body', btoa(updatedData.body));
    }
    
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  return (
    <div className={s.restClient}>
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
