@Post('create')
create(@Body('service') service: string) {
  return this.queueService.createToken(service);
}