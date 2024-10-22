import { faker } from '@faker-js/faker'

export const rtcStat = (): RTCStats[] => {
  const statsTypes: RTCStatsType[] = [
    'inbound-rtp',
    'outbound-rtp',
    'candidate-pair',
    'local-candidate',
    'remote-candidate',
    'data-channel',
    'media-playout',
    'peer-connection',
    'remote-outbound-rtp',
    'transport',
  ]

  return statsTypes.map((type) => ({
    id: faker.string.uuid(),
    type,
    timestamp: faker.date.recent().getTime(), // Current timestamp
    bytesSent: ['outbound-rtp', 'remote-outbound-rtp'].includes(type)
      ? faker.number.int({ min: 1000, max: 1000000 })
      : null,
    bytesReceived:
      type === 'inbound-rtp'
        ? faker.number.int({ min: 1000, max: 1000000 })
        : null,
    packetsSent: ['outbound-rtp', 'remote-outbound-rtp'].includes(type)
      ? faker.number.int({ min: 10, max: 10000 })
      : null,
    packetsReceived:
      type === 'inbound-rtp' ? faker.number.int({ min: 10, max: 10000 }) : null,
    jitter: ['inbound-rtp', 'outbound-rtp', 'remote-outbound-rtp'].includes(
      type,
    )
      ? faker.number.float({ min: 0, max: 100 })
      : null,
    dataChannelId: type === 'data-channel' ? faker.string.uuid() : null,
    peerConnectionId: type === 'peer-connection' ? faker.string.uuid() : null,
    mediaPlayoutId: type === 'media-playout' ? faker.string.uuid() : null,
    transportId: type === 'transport' ? faker.string.uuid() : null,
  }))
}

export const jsMemory = () => {
  const jsHeapSizeLimit = faker.number.int({ min: 100000000, max: 2000000000 })
  const totalJSHeapSize = faker.number.int({
    min: 50000000,
    max: jsHeapSizeLimit,
  })
  const usedJSHeapSize = faker.number.int({
    min: 10000000,
    max: totalJSHeapSize,
  })

  return {
    jsHeapSizeLimit,
    totalJSHeapSize,
    usedJSHeapSize,
  }
}
