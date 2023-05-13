// Copyright (c) Microsoft. All rights reserved.

using System.Reflection;
using Azure.Identity;

namespace SemanticKernel.Service;

internal static class ConfigExtensions
{
    /// <summary>
    /// Build the configuration for the service.
    /// </summary>
    public static IHostBuilder AddConfiguration(this IHostBuilder host)
    {
        string? environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        host.ConfigureAppConfiguration((builderContext, configBuilder) =>
        {
            configBuilder.AddJsonFile(
                path: "appsettings.json",
                optional: false,
                reloadOnChange: true);

            configBuilder.AddJsonFile(
                path: $"appsettings.{environment}.json",
                optional: true,
                reloadOnChange: true);

            configBuilder.AddEnvironmentVariables();

            configBuilder.AddUserSecrets(
                assembly: Assembly.GetExecutingAssembly(),
                optional: true,
                reloadOnChange: true);
        });

        return host;
    }
}
