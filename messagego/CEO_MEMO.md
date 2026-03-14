# What MessageGO Needs

We got the contract signed, and our e-commerce client is ready to go. I want to be upfront about what's really holding us back from launching successfully. It's not just the code, but everything else that goes with it.

## What the customer really wants from us

This client sends out order confirmations and keeps you updated on shipping and deliveries. If someone buys something and doesn't get a confirmation email, they'll probably think there's a problem. That's why these messages are so crucial. Reliability is just expected, not something extra.

They need a way to send messages through email, SMS, and WhatsApp, all using the same system. That's all for our presentation. But they also need to consider a few things on their end.

It would be good to confirm that a message actually got to the person it was sent to. They can't just set it and forget it. If a shipping notification doesn't go through, they need to be told so they can try sending it again or use a different way to get the message across. We need to be able to track if a message was received, not just send it out.

It's like a testing area. Their developers won't instantly connect their system to ours. They need a secure space to test how their systems work together without actually messaging real customers. Any messaging API, like Twilio or SendGrid, gives us this. If we don't do this, we won't be taken seriously.

Useful guides that their developers can actually use. Here's the API guide, some code examples, and a quick way to get started. If their team needs to email us just to figure out how to send a message, then we haven't done a good enough job making things easy for developers.

## What we need to build

The API is pretty simple. There's one place to send messages and another to check how they're doing. It also does some basic checks and sends the messages to the right service, like Twilio for texts and WhatsApp, or SendGrid for emails. We can also use other services if we need to.

What needs more thinking about:

**Provider accounts and relationships.** We'll have to reach out to the actual providers, get those API keys, and for WhatsApp, that means we're also going through Meta's business verification. This won't happen right away. Getting WhatsApp approved can take a few weeks. Let's get this going now, while we're still developing.

**How much it costs and how we figure out that cost.** Every text or email we send costs us money. We need to figure out how much to charge the client. You mean per message, right? So, for monthly volumes? We should figure out our profit margins before agreeing on a price in the contract, if we haven't done that yet.

**How to deal with errors and try again.** Sometimes, companies that provide services stop working. Twilio's services went down a couple of times last year. If we don't try again when something goes wrong, and our service provider has a quick five-minute outage, our client will lose messages. You really need to have basic retry with backoff. It's not something you can just choose to add later if you feel like it.

## What else do you need besides the code

**Register who sends SMS messages.** You know, in lots of places, you can't just text someone from any old number. We need to register a sender ID. If we don't, our messages will likely be marked as spam. You have to do this; it's not something you can choose to skip.

**Getting your WhatsApp Business API approved.** So, like I said, Meta needs you to have a verified business account. If a business wants to send out messages, say to let you know your order has shipped, they have to use message templates that WhatsApp has already approved. We have to think about this.

**Data use agreement.** We will handle customer phone numbers, emails, and messages for the client. We'll need to get a data processing agreement in place that meets GDPR rules. The lawyers need to write this up.

**This is how we'll do it.** If something breaks down in the middle of the night, say two in the morning, and customers stop getting shipping updates, who do they usually call? We need to figure out how our on-call system will work and what our service level agreement, or SLA, will be. Basically, how much uptime are we promising? even if it's just the two of us taking turns for now.

## What I'd Focus On

**This week, you should first** register for WhatsApp Business verification and SMS sender. They are slow outside processes that hold us back no matter how quickly we work.

**For the first couple of weeks,** we built the main parts of our API. This included getting messages to send, keeping an eye on their status, checking everything was correct, and setting up fake providers so we could test things out in our sandbox environment. API documents. This lets their developers start integrating right away.

**From week three to four,** we focused on hooking up real services like Twilio and SendGrid. We also put in place systems to retry things if they fail and monitors to keep an eye on everything. After this, we can start.

**After we launch,** we'll have a dashboard where clients can see how many messages they're sending and if any failed. We'll also support webhooks so they can get instant updates. There will be a template system too, and we're building multi-tenant features for our future clients.

The contract is already signed, so making sure the shipping is reliable is more important than getting it there quickly. I'd rather ship a week later with good delivery tracking and retries built in, than put out something quickly that loses messages.
