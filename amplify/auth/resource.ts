import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },

  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
  },

  userAttributes: {
    email: {
      required: true,
      mutable: true
    },
    phoneNumber: {
      required: false,
      mutable: true
    },
    givenName: {
      required: true,
      mutable: true
    },
    familyName: {
      required: false,
      mutable: true
    }
  },
});
