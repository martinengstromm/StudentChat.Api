using StudentChat.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Ativera SignalR
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
	options.AddPolicy("ReactApp", policy =>
	{
		policy
			.WithOrigins("http://localhost:3000")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.UseHttpsRedirection();

// Cors regler för react
app.UseCors("ReactApp");

app.UseAuthorization();

app.MapControllers();

// Kopplat ChatHub till /chatHub
app.MapHub<ChatHub>("/chatHub");

app.Run();
