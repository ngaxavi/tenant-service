import { MongoPipe } from '@tenant/validation';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Roles, RolesGuard } from '@tenant/auth';
import { KafkaExceptionFilter } from '@tenant/kafka';
import { Occupant } from './tenant.schema';
import { CreateOccupantDto, UpdateOccupantDto } from './dto';

@Controller('tenants/occupants')
@UseGuards(RolesGuard)
@UseFilters(KafkaExceptionFilter)
@UsePipes(new ValidationPipe())
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
  ) {}

  @Post()
  @Roles('create')
  async createOne(@Body() dto: CreateOccupantDto): Promise<Occupant> {
    return this.tenantService.createOne(dto);
  }

  @Get()
  @Roles('read')
  async findAll(): Promise<Occupant[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  @Roles('read')
  async findOne(@Param('id', new MongoPipe()) id: string): Promise<Occupant> {
    return this.tenantService.findOne(id);
  }

  @Put(':id')
  @Roles('update')
  async updateOne(@Param('id', new MongoPipe()) id: string, @Body() dto: UpdateOccupantDto): Promise<Occupant> {
    return this.tenantService.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles('delete')
  async deleteOne(@Param('id', new MongoPipe()) id: string): Promise<string> {
    return this.tenantService.deleteOne(id);
  }

}
