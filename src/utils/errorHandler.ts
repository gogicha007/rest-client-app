export const handleError = (
  error: unknown
): { type: 'application' | 'http'; message: string } => {
  if (isAxiosError(error)) {
    const { status, statusText } = error.response || {};
    return {
      type: 'http',
      message: `${status || 'Unknown'}: ${statusText || 'Error'}`,
    };
  } else if (error instanceof Error && error.message) {
    return {
      type: 'application',
      message: error.message || 'An unexpected error occurred.',
    };
  } else {
    return { type: 'application', message: 'An unknown error occurred.' };
  }
};

function isAxiosError(
  error: unknown
): error is { response?: { status: number; statusText: string } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
