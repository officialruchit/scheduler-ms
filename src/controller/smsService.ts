import twilio from 'twilio';
import { IUser } from '../model/user';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
export const sendSmsNotification = async (
  user: IUser,
  message: string,
  countryCode: string,
): Promise<void> => {
  try {
    // Ensure the phone number is formatted with the country code
    const formattedPhoneNumber = `${countryCode}${user.phoneNumber}`;

    await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: formattedPhoneNumber,
    });
    console.log(`SMS sent to ${formattedPhoneNumber}`);
  } catch (err) {
    console.error('Failed to send SMS:', err);
  }
};
