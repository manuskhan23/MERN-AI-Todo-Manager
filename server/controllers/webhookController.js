import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return res.status(400).send('Webhook secret not configured.');
  }

  // Get the headers
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send('Error occurred -- no svix headers');
  }

  const payload = req.body;
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send('Error occurred');
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0].email_address;
    const username = `${first_name || ''} ${last_name || ''}`.trim() || email.split('@')[0];

    await User.create({ clerkId: id, email, username, imageUrl: image_url });
  }

  res.status(200).send('');
};