using Google.Authenticator;
using System;
using SI_Web_API.Model;
using SI_Web_API.Data;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Text;

public class TwoFactorAuthService
{
    private const string ValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    public static string GenerateRandomSecretKey()
    {
        var random = new Random();
        var secretKey = new char[20];

        for (int i = 0; i < secretKey.Length; i++)
        {
            secretKey[i] = ValidChars[random.Next(ValidChars.Length)];
        }

        return new string(secretKey);
    }

    public static SetupCode GenerateSetupCode(User user, SI_Web_APIContext db)
    {
        string secretKey = GenerateRandomSecretKey();
        user.SecretKey = secretKey;
        db.SaveChanges();

        var authenticator = new TwoFactorAuthenticator();
        return authenticator.GenerateSetupCode("SIWeb App", user.FullName, ConvertSecretToBytes(secretKey, false), 300);
    }

    public static bool ValidateToken(string secretKey, string code)
    {
        var authenticator = new TwoFactorAuthenticator();
        return authenticator.ValidateTwoFactorPIN(secretKey, code);
    }

    private static byte[] ConvertSecretToBytes(string secret, bool secretIsBase32) =>
           secretIsBase32 ? Base32Encoding.ToBytes(secret) : Encoding.UTF8.GetBytes(secret);
}
