﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace KanbanMVC.DBContext
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class KanbanDBEntities : DbContext
    {
        public KanbanDBEntities()
            : base("name=KanbanDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<cardlist> cardlist { get; set; }
        public virtual DbSet<cards> cards { get; set; }
        public virtual DbSet<projects> projects { get; set; }
        public virtual DbSet<subcardlist> subcardlist { get; set; }
        public virtual DbSet<tasks> tasks { get; set; }
    }
}