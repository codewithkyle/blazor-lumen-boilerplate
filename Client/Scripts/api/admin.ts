async function GetUsers(page: number = 0, limit: number = 10): Promise<UsersResponse> {
	const request = await apiRequest(`/v1/admin/users?p=${page}&limit=${limit}`);
	const fetchResponse: FetchReponse = await request.json();
	const response: Partial<UsersResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	response.Users = [];
	for (let i = 0; i < fetchResponse.data.users.length; i++) {
		const user = fetchResponse.data.users[i];
		response.Users.push({
			Name: user.name,
			Email: user.email,
			Uid: user.uid,
			Groups: user.groups,
			Suspended: user.suspended === 1 ? true : false,
			Verified: user.verified === 1 ? true : false,
			Admin: user.admin === 1 ? true : false,
			Avatar: user.avatar,
		});
	}
	response.Total = fetchResponse.data.total;
	return response as UsersResponse;
}

async function SuspendUser(uid: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/ban`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function UnsuspendUser(uid: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/unban`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function ActivateUser(uid: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/activate`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function SendActivationEmail(uid: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/send-activation-email`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function RevokeAdmin(uid: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/revoke-admin-status`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function GrantAdmin(uid: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/grant-admin-status`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function GetImpersonationLink(uid: string): Promise<ImpersonationLinkResponse> {
	const request = await apiRequest(`/v1/admin/impersonation-link`, "POST", { uid: uid });
	const fetchResponse: FetchReponse = await request.json();
	const response: Partial<ImpersonationLinkResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	response.URL = `${location.origin}/admin/impersonate/${fetchResponse.data.token}`;
	return response as ImpersonationLinkResponse;
}

async function Impersonate(jwt: string): Promise<ResponseCore> {
	const request = await apiRequest(`/v1/admin/impersonate`, "POST", { token: jwt });
	const fetchResponse: FetchReponse = await request.json();
	const response: ResponseCore = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function ClearApplicationCache(): Promise<ResponseCore> {
	const request = await apiRequest("/v1/admin/clear-redis-cache", "POST");
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function ClearCloudflareCache(): Promise<ResponseCore> {
	const request = await apiRequest("/v1/admin/clear-cloudflare-cache", "POST");
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function ClearNDJSONCache(): Promise<ResponseCore> {
	const request = await apiRequest("/v1/admin/clear-ndjson-cache", "POST");
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function SetMaintenanceMode(isUndergoingMaintenance: boolean): Promise<ResponseCore> {
	const data = {
		maintenance: isUndergoingMaintenance,
	};
	const request = await apiRequest("/v1/admin/set-maintenance-mode", "POST", data);
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}
