export const useTranslations = () => (key) => key;
export const useFormatter = () => ({
  number: jest.fn(),
  dateTime: jest.fn(),
  relativeTime: jest.fn(),
  list: jest.fn(),
});
export const NextIntlClientProvider = ({ children }) => children;
