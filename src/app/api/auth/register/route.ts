import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "../../../../../lib/prisma";
import { credentialsLogIn } from "../../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      
      await credentialsLogIn(email, password);
      
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "account created successfully" },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}