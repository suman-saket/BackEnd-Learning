export const kafkaConfig = {
  broker: process.env.KAFKA_BROKER ?? 'localhost:9092',
  eventsTopic: process.env.KAFKA_EVENTS_TOPIC ?? 'user.events',
  producerClientId: process.env.KAFKA_CLIENT_ID ?? 'activity-tracker-api',
  consumerFromBeginning: process.env.KAFKA_CONSUMER_FROM_BEGINNING === 'true',
};

export const consumerGroups = {
  pageView: 'page-view-processors',
  click: 'click-processors',
  session: 'session-processors',
} as const;
