import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Req() req, @Body() body: { accountId: number; amount: number }) {
    return this.transactionsService.deposit(
      req.user.userId,
      body.accountId,
      body.amount,
    );
  }

  @Post('withdraw')
  withdraw(@Req() req, @Body() body: { accountId: number; amount: number }) {
    return this.transactionsService.withdraw(
      req.user.userId,
      body.accountId,
      body.amount,
    );
  }

  @Post('transfer')
  transfer(
    @Req() req,
    @Body()
    body: { accountId: number; amount: number; targetAccountId: number },
  ) {
    return this.transactionsService.tranfer(
      req.user.userId,
      body.accountId,
      body.amount,
      body.targetAccountId,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.transactionsService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.transactionsService.findOneByUser(req.user.userId, +id);
  }
}
