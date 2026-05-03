async createToken(serviceName: string) {

  // last token find
  const last = await this.queueModel
    .findOne({ service: serviceName })
    .sort({ createdAt: -1 });

  let nextNumber = 1;

  if (last) {
    const lastNumber = parseInt(last.token.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  // format token
  const token = `${serviceName}-A-${String(nextNumber).padStart(3, '0')}`;

  const newToken = new this.queueModel({
    token,
    service: serviceName,
  });

  return newToken.save();
}