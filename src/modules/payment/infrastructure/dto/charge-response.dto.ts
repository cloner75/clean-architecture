import { ApiProperty } from '@nestjs/swagger';

export class ChargeResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Internal payment record identifier.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  paymentId!: string;

  @ApiProperty({
    enum: ['completed', 'failed'],
    description: 'Outcome after attempting to charge via the payment gateway.',
    example: 'completed',
  })
  status!: 'completed' | 'failed';

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Gateway or PSP reference id when the provider returns one.',
    example: 'txn_ext_01HZXYZ',
  })
  externalId?: string;
}
