using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Munched.Models.API;

namespace Munched.Pages.Utility.Verification
{
    public class PendingEmailVerificationBase : ComponentBase
    {

        [Inject]
        private NavigationManager NavigationManager { get; set; }

        [Inject]
        private IJSRuntime JSRuntime { get; set; }

        public bool IsSending = false;

        public async Task ResendVerificationEmail()
        {
            IsSending = true;
            StateHasChanged();
            ResponseCore Response = await JSRuntime.InvokeAsync<ResponseCore>("ResendVerificationEmail");
            IsSending = false;
            StateHasChanged();
            if (Response.Success){
                await JSRuntime.InvokeVoidAsync("Notify", "Verification email has been sent.");
            } else {
                NavigationManager.NavigateTo("/");
            }
        }
    }
}