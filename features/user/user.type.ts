export const signInType  = "user/signin"
export const signUpType  = "user/signup"


interface SignInPayload {
    email: string;
    password: string;
}

interface SignUpPayload {
    name: string;
    email: string;
    image: File | null;
    password: string;
}

export type { SignInPayload , SignUpPayload }