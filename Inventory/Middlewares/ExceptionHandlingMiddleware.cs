using Inventory.Common;
using Microsoft.OpenApi.Any;
using System.Net;
using System.Text.Json;

namespace Inventory.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;

        public ExceptionHandlingMiddleware(RequestDelegate next, IWebHostEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        public async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            var (statusCode, message) = ex switch
            {
                ArgumentException => ((int)HttpStatusCode.BadRequest, ex.Message),
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, ex.Message),
                InvalidOperationException => ((int)HttpStatusCode.Conflict, ex.Message),
                _ => ((int)HttpStatusCode.InternalServerError, "An unexpected error occured")
            };

            var error = new ApiErrorResponse
            { 
                StatusCode = statusCode,
                Message = message,
                Detail = _env.IsDevelopment() ? ex.ToString() : null
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(error, new JsonSerializerOptions
            { 
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);

        }

    }
}
