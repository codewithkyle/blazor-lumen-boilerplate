using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Client.Models.Forms;
using Client.Models.API;
using Client.Models.Pages;
using Client.Models.Data;
using System.Collections.Generic;

namespace Client.Pages.Admin
{
    public class UsersAdmin : AdminPage
    {
        public List<User> Users = new List<User>();
        public bool IsLoadingUserData = true;
        public int UsersPerPage = 10;
        public int Page = 1;
        public int TotalUsers = 0;
        public int TotalPages = 1;

        protected override async Task Main()
        {
            await LoadUserData();
        }

        public async Task LoadUserData()
        {
            IsLoadingUserData = true;
            StateHasChanged();
            UsersResponse UsersResponse = await JSRuntime.InvokeAsync<UsersResponse>("GetUsers", Page - 1, UsersPerPage);
            if (UsersResponse.Success)
            {
                Users = UsersResponse.Users;
                TotalUsers = UsersResponse.Total;
                TotalPages = (int)Math.Ceiling((decimal)TotalUsers / UsersPerPage);
                IsLoadingUserData = false;
            }
            else
            {
                await JSRuntime.InvokeVoidAsync("Alert", "error", "Something Went Wrong", UsersResponse.Error);
            }
            StateHasChanged();
        }

        public async Task UpdateUsersPerPage(ChangeEventArgs e)
        {
            UsersPerPage = Int32.Parse(e.Value.ToString());
            Page = 1;
            await LoadUserData();
        }

        public async Task NextPage()
        {
            Page++;
            Console.Write(Page);
            if (Page > TotalPages){
                Page = TotalPages;
            }
            await LoadUserData();
        }

        public async Task PreviousPage()
        {
            Page--;
            if (Page <= 0){
                Page = 1;
            }
            await LoadUserData();
        }

        public async Task JumpToPage(ChangeEventArgs e)
        {
            Page = Int32.Parse(e.Value.ToString());
            await LoadUserData();
        }
    }
}