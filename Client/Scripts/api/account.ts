async function GetProfile(): Promise<ProfileResponse> {
	const request = await apiRequest("/v1/user/profile");
	const fetchResponse: FetchReponse = await request.json();
	const response: Partial<ProfileResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	if (response.Success) {
		response.User = {
			Name: fetchResponse.data.name,
			Email: fetchResponse.data.email,
			Uid: fetchResponse.data.uid,
			Groups: fetchResponse.data.groups,
			Suspended: fetchResponse.data.suspended === 1 ? true : false,
			Verified: fetchResponse.data.verified === 1 ? true : false,
			Admin: fetchResponse.data.admin === 1 ? true : false,
			Avatar: fetchResponse.data.avatar,
		};
	}
	return response as ProfileResponse;
}

async function UpdateProfile(name: string, email: string): Promise<ResponseCore> {
	const data = {
		name: name,
		email: email,
	};
	const request = await apiRequest("/v1/user/profile", "POST", data);
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function UpdatePassword(oldPassword: string, newPassword: string): Promise<ResponseCore> {
	const data = {
		oldPassword: oldPassword,
		newPassword: newPassword,
	};
	const request = await apiRequest("/v1/user/update-password", "POST", data);
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	return response;
}

async function DeleteAccount(): Promise<ResponseCore> {
	const request = await apiRequest("/v1/user/profile", "DELETE");
	const fetchResponse = await request.json();
	const response = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	if (response.Success) {
		ClearStorage();
		LogoutAllInstances();
	}
	return response;
}

async function UpdateProfileAvatar(): Promise<ProfileResponse> {
	const input: HTMLInputElement = document.body.querySelector(`input[type="file"]#avatar`);
	const image = await ConvertToBase64(input.files[0]);
	const data = {
		file: image,
	};
	const request = await apiRequest("/v1/user/profile/avatar", "POST", data);
	const fetchResponse = await request.json();
	const response: Partial<ProfileResponse> = buildResponseCore(fetchResponse.success, request.status, fetchResponse.error);
	if (response.Success) {
		response.User = {
			Name: fetchResponse.data.name,
			Email: fetchResponse.data.email,
			Uid: fetchResponse.data.uid,
			Groups: fetchResponse.data.groups,
			Suspended: fetchResponse.data.suspended === 1 ? true : false,
			Verified: fetchResponse.data.verified === 1 ? true : false,
			Admin: fetchResponse.data.admin === 1 ? true : false,
			Avatar: fetchResponse.data.avatar,
		};
	}
	return response as ProfileResponse;
}
