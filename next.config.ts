import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  sassOptions: {
    includePaths: [require('path').join(__dirname, 'styles')],
    additionalData: ``,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
