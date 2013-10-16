
using AutoMapper;
using TelBook.DataObjects;
using TelBook.Domain;
using System.Collections.Generic;
namespace TelBook.WebClient
{
    public class MappingConfig
    {
        public static void Register()
        {
            Mapper.CreateMap<User, UserData>()
                .ForMember(x => x.RoleName, o => o.MapFrom(m => m.Role.Name))
                .ForMember(x => x.LastLoginDate, o => o.MapFrom(m => m.LastLoginDate.ToString()));
            Mapper.CreateMap<Role, RoleData>();
            Mapper.CreateMap<TelGroup, TelGroupData>();
            Mapper.CreateMap<Tel, TelData>()
                .ForMember(x => x.GroupName, o => o.MapFrom(m => m.TelGroup.Name));
        }
    }
}