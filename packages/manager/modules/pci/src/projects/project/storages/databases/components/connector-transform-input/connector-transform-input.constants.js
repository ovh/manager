export const TRANSFORMATIONS_TYPES = [
  'org.apache.kafka.connect.transforms.InsertField$Key',
  'org.apache.kafka.connect.transforms.InsertField$Value',
  'org.apache.kafka.connect.transforms.ReplaceField$Key',
  'org.apache.kafka.connect.transforms.ReplaceField$Value',
  'org.apache.kafka.connect.transforms.MaskField$Key',
  'org.apache.kafka.connect.transforms.MaskField$Value',
  'org.apache.kafka.connect.transforms.ValueToKey',
  'org.apache.kafka.connect.transforms.HoistField$Key',
  'org.apache.kafka.connect.transforms.HoistField$Value',
  'org.apache.kafka.connect.transforms.ExtractField$Key',
  'org.apache.kafka.connect.transforms.ExtractField$Value',
  'org.apache.kafka.connect.transforms.SetSchemaMetadata$Key',
  'org.apache.kafka.connect.transforms.SetSchemaMetadata$Value',
  'org.apache.kafka.connect.transforms.TimestampRouter',
  'org.apache.kafka.connect.transforms.RegexRouter',
  'org.apache.kafka.connect.transforms.Flatten$Key',
  'org.apache.kafka.connect.transforms.Flatten$Value',
  'org.apache.kafka.connect.transforms.Cast$Key',
  'org.apache.kafka.connect.transforms.Cast$Value',
  'org.apache.kafka.connect.transforms.TimestampConverter$Key',
  'org.apache.kafka.connect.transforms.TimestampConverter$Value',
  'io.aiven.kafka.connect.transforms.ExtractTimestamp$Key',
  'io.aiven.kafka.connect.transforms.ExtractTimestamp$Value',
  'io.aiven.kafka.connect.transforms.ExtractTopic$Key',
  'io.aiven.kafka.connect.transforms.ExtractTopic$Value',
  'io.aiven.kafka.connect.transforms.Hash$Key',
  'io.aiven.kafka.connect.transforms.Hash$Value',
  'io.aiven.kafka.connect.transforms.TombstoneHandler',
  'io.debezium.transforms.ByLogicalTableRouter',
  'io.debezium.transforms.ExtractNewRecordState',
  'io.debezium.transforms.outbox.EventRouter',
];

export default {
  TRANSFORMATIONS_TYPES,
};
