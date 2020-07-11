import { CreateTenantCommand } from '../tenant/commands/create-tenant.command';
import { Command } from '../tenant/commands/command';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const KafkaCommand = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
  const ctxData = ctx.switchToRpc().getData();
  const value = ctxData.value;
  if (!ctxData || !ctxData.value || !ctxData.topic || !value.type) {
    throw new RpcException('Invalid kafka message');
  }

  let command: Command;

  switch (value.type) {
    case 'CreateTenant':
      command = plainToClass(CreateTenantCommand, value);
      break;
    default:
      throw new RpcException('Unknow command type');
  }

  // Validate
  const errors = await validate(command);
  if (errors.length > 0) {
    throw new RpcException(errors);
  }

  return command;
});
