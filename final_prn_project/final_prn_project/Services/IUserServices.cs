namespace final_prn_project.Services
{
    public interface IUserServices
    {
        public string CreateRandomToken(string email);
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
    }
}
