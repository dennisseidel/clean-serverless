/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  someSidebar: {
    Introduction: ['introduction/preface', 'introduction/what-is-serverless', 'introduction/what-is-aws-lambda', 'introduction/why-create-serverless-apps'],
    'Setup': [ 
      'setup/setup-aws',
      {
        type: 'category',
        label: 'Setup Serverless Backend',
        items: [
          'setup/create-a-dynamodb-table', 
          'setup/create-an-s3-bucket-for-file-uploads', 
          'setup/create-a-cognito-user-pool', 
          'setup/setup-the-serverless-framework',
          'setup/initialize-the-backend-repo' ],
      },
    ],
    'Backend': [
      {
        type: 'category',
        label: 'Building a Serverless REST API',
        items: [
          'backend/add-a-create-note-api',
          'backend/add-a-get-note-api',
          'backend/add-a-list-all-the-notes-api',
          'backend/add-an-update-note-api',
          'backend/add-a-delete-note-api',
          'backend/working-with-3rd-party-apis',
          'backend/setup-a-stripe-account',
          'backend/add-a-billing-api',
          'backend/load-secrets-from-env',
          'backend/test-the-billing-api',
          'backend/unit-tests-in-serverless',
          'backend/handle-api-gateway-cors-errors'
        ]
      },
      {
        type: 'category',
        label: 'Deploying the backend',
        items: [
          'backend/deploy-the-apis',
          'backend/create-a-cognito-identity-pool',
          'backend/test-the-apis'
        ]
      },
    ],
    'Frontend': [
      {
        type: 'category',
        label: 'Setting up a React app',
        items: [
          'frontend/create-a-new-reactjs-app',
          'frontend/initialize-the-frontend-repo',
          'frontend/add-app-favicons',
          'frontend/setup-custom-fonts',
          'frontend/setup-bootstrap',
          'frontend/handle-routes-with-react-router',
          'frontend/configure-aws-amplify'
        ]
      },
      {
        type: 'category',
        label: 'Create a login page',
        items: [
          'frontend/create-a-login-page',
          'frontend/login-with-aws-cognito',
          'frontend/add-the-session-to-the-state',
          'frontend/load-the-state-from-the-session',
          'frontend/clear-the-session-on-logout',
          'frontend/redirect-on-login-and-logout',
          'frontend/give-feedback-while-logging-in',
          'frontend/create-a-custom-react-hook-to-handle-form-fields',
        ]
      }, 
      {
        type: 'category',
        label: 'Create a Signup Page',
        items: [
          'frontend/create-a-signup-page',
          'frontend/create-the-signup-form',
          'frontend/signup-with-aws-cognito',
        ]
      },
      {
        type: 'category',
        label: 'Add the Create Note Page',
        items: [
          'frontend/add-the-create-note-page',
          'frontend/call-the-create-api',
          'frontend/upload-a-file-to-s3',
        ]
      },
      {
        type: 'category',
        label: 'List All the Notes',
        items: [
          'frontend/list-all-the-notes',
          'frontend/call-the-list-api',
        ]
      },
      {
        type: 'category',
        label: 'Display a Note',
        items: [
          'frontend/display-a-note',
          'frontend/render-the-note-form',
          'frontend/save-changes-to-a-note',
          'frontend/delete-a-note',
        ]
      },
      {
        type: 'category',
        label: 'Create a Settings Page',
        items: [
          'frontend/create-a-settings-page',
          'frontend/add-stripe-keys-to-config',
          'frontend/create-a-billing-form',
          'frontend/connect-the-billing-form',
        ]
      },
      {
        type: 'category',
        label: 'Set up Secure Pages',
        items: [
          'frontend/setup-secure-pages',
          'frontend/create-a-route-that-redirects',
          'frontend/use-the-redirect-routes',
          'frontend/redirect-on-login',
        ]
      },
    ],
    'Deploying the backend to production': [
      'production/getting-production-ready',
      'production/what-is-infrastructure-as-code',
      'production/configure-dynamodb-in-serverless',
      'production/configure-s3-in-serverless',
      'production/configure-cognito-user-pool-in-serverless',
      'production/configure-cognito-identity-pool-in-serverless',
      'production/deploy-your-serverless-infrastructure',
      {
        type: 'category',
        label: 'Automating Serverless deployments',
        items: [
          'production/automating-serverless-deployments',
          'production/setting-up-your-project-on-github',
          'production/configure-secrets-in-github',
          'production/deploying-through-github',
          'production/set-custom-domains',
        ]
      }, 
      'production/test-the-configured-apis',
      'production/monitoring-deployments'
    ],
    'Deploying the frontend to production': [
      {
        type: 'category',
        label: 'Deploying a React app to AWS',
        items: [
          'production/deploying-a-react-app-to-aws',
          'production/create-an-s3-bucket',
          'production/deploy-to-s3',
          'production/create-a-cloudfront-distribution',
          'production/setup-www-domain-redirect',
          'production/setup-ssl',
          'production/setup-your-domain-with-cloudfront',
          'production/deploy-updates',
        ]
      }, 
      {
        type: 'category',
        label: 'Automating React Deployments',
        items: [
          'production/automating-react-deployments',
          'production/manage-environments-in-create-react-app',
          'production/create-a-build-script',
          'production/setting-up-your-project-on-netlify',
          'production/custom-domain-in-netlify',
        ]
      },
      'production/frontend-workflow'
    ],
    'Best Practices': [
      'best-practices/best-practices-for-building-serverless-apps',
      {
        type: 'category',
        label: 'Organize a Serverless app',
        items: [
          'best-practices/organizing-serverless-projects',
          {
            type: 'category',
            label: 'Cross-Stack References in Serverless',
            items: [
              'best-practices/cross-stack-references-in-serverless',
              'best-practices/dynamodb-as-a-serverless-service',
              'best-practices/s3-as-a-serverless-service',
              'best-practices/cognito-as-a-serverless-service',
            ]
          },
          'best-practices/share-code-between-services',
          'best-practices/share-an-api-endpoint-between-services',
          'best-practices/deploy-a-serverless-app-with-dependencies',
        ]
      },
      {
        type: 'category',
        label: 'Manage environments',
        items: [
          'best-practices/environments-in-serverless-apps',
          'best-practices/structure-environments-across-aws-accounts',
          'best-practices/manage-aws-accounts-using-aws-organizations',
          'best-practices/parameterize-serverless-resources-names',
          'best-practices/deploying-to-multiple-aws-accounts',
          'best-practices/manage-environment-related-config',
          'best-practices/storing-secrets-in-serverless-apps',
          'best-practices/share-route-53-domains-across-aws-accounts',
          'best-practices/monitor-usage-for-environments',
          'best-practices/improve-resource-usage-and-cost',
        ]
      },
      {
        type: 'category',
        label: 'Development lifecycle',
        items: [
          'best-practices/working-on-serverless-apps',
          'best-practices/invoke-lambda-functions-locally',
          'best-practices/invoke-api-gateway-endpoints-locally',
          'best-practices/creating-feature-environments',
          'best-practices/creating-pull-request-environments',
          'best-practices/promoting-to-production',
          'best-practices/rollback-changes',
          'best-practices/deploying-only-updated-services',
        ]
      },
      {
        type: 'category',
        label: 'Obeservability',
        items: [
          'best-practices/tracing-serverless-apps-with-x-ray'
        ]
      }, 
      'best-practices/wrapping-up-the-best-practices'
    ],
    'Conclusion': [
      'conclusion/wrapping-up',
      'conclusion/further-reading',
      'conclusion/giving-back',
      'conclusion/staying-up-to-date'
    ],
    'Serverless Lessons': [
      'extra/serverless/api-gateway-and-lambda-logs',
      'extra/serverless/debugging-serverless-api-issues',
      'extra/serverless/serverless-environment-variables',
      'extra/serverless/stages-in-serverless-framework',
      'extra/serverless/backups-in-dynamodb',
      'extra/serverless/configure-multiple-aws-profiles',
      'extra/serverless/customize-the-serverless-iam-policy',
      'extra/serverless/mapping-cognito-identity-id-and-user-pool-id',
      'extra/serverless/connect-to-api-gateway-with-iam-auth',
      'extra/serverless/serverless-nodejs-starter',
      'extra/serverless/package-lambdas-with-serverless-bundle',
    ],
    'React Lessons': [
      'extra/react/understanding-react-hooks',
      'extra/react/code-splitting-in-create-react-app',
      'extra/react/environments-in-create-react-app',
      'extra/react/manage-user-accounts-in-aws-amplify',
      'extra/react/facebook-login-with-cognito-using-aws-amplify',
    ]
  },
};
