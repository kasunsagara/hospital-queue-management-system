import { JwtService } from '@nestjs/jwt';

async login(data) {
  const user = await this.userModel.findOne({ email: data.email });

  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) throw new Error('Invalid password');

  const token = this.jwtService.sign({
    userId: user._id,
    role: user.role,
  });

  return { token };
}