const API_URL = "http://api.munched.local";

interface ResponseCore {
    Success: boolean;
    StatusCode: number;
    Error: string;
}

interface FormResponse extends ResponseCore {
    FieldErrors: string[];
}

async function RegisterUser(email: string, password: string, name: string): Promise<FormResponse> {
    const data = {
        email: email,
        password: password,
        name: name,
    };
    const request = await fetch(`${API_URL}/v1/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
    const fetchResponse = await request.json();
    const response: Partial<FormResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
    if (!response.Success) {
        response.FieldErrors = fetchResponse.data;
    }
    return response as FormResponse;
}

interface LoginResponse extends FormResponse {
    IsPendingEmailVerificaiton: boolean;
}
async function LoginUser(email: string, password: string): Promise<LoginResponse> {
    const data = {
        email: email,
        password: password,
    };
    const request = await fetch(`${API_URL}/v1/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
    const fetchResponse = await request.json();
    const response: Partial<LoginResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
    if (response.Success) {
        localStorage.setItem("token", fetchResponse.data.token);
        response.IsPendingEmailVerificaiton = fetchResponse.data.pendingEmailVerification;
    } else {
        response.FieldErrors = fetchResponse.data;
        response.IsPendingEmailVerificaiton = false;
    }
    return response as LoginResponse;
}

interface ProfileResponse extends ResponseCore {
    Name: string;
    Email: string;
    UID: string;
}
async function GetProfile(): Promise<ProfileResponse> {
    const request = await fetch(`${API_URL}/v1/user/profile`, {
        method: "GET",
        headers: buildHeaders(),
    });
    const fetchResponse = await request.json();
    const response: Partial<ProfileResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
    if (response.Success) {
        response.Name = fetchResponse.data.name;
        response.Email = fetchResponse.data.email;
        response.UID = fetchResponse.data.uid;
    }
    return response as ProfileResponse;
}

async function ResendVerificationEmail(): Promise<ResponseCore> {
    const request = await fetch(`${API_URL}/v1/resend-verification-email`, {
        method: "POST",
        headers: buildHeaders(),
    });
    const fetchResponse = await request.json();
    return buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
}

async function RefreshToken(): Promise<ResponseCore> {
    const request = await fetch(`${API_URL}/v1/refresh-token`, {
        method: "POST",
        headers: buildHeaders(),
    });
    const fetchResponse = await request.json();
    const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
    if (response.Success) {
        localStorage.setItem("token", fetchResponse.data.token);
    }
    return response;
}
