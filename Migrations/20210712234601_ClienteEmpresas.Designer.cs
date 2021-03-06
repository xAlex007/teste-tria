// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using teste_tria.Models;

namespace teste_tria.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20210712234601_ClienteEmpresas")]
    partial class ClienteEmpresas
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("teste_tria.Models.Cliente", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("CPF")
                        .IsRequired()
                        .HasColumnType("varchar(11) CHARACTER SET utf8mb4")
                        .HasMaxLength(11);

                    b.Property<DateTime>("DtCriacao")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .HasColumnType("varchar(150) CHARACTER SET utf8mb4")
                        .HasMaxLength(150);

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("varchar(200) CHARACTER SET utf8mb4")
                        .HasMaxLength(200);

                    b.HasKey("Id");

                    b.ToTable("Clientes");
                });

            modelBuilder.Entity("teste_tria.Models.ClienteEmpresa", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<long>("ClienteID")
                        .HasColumnType("bigint");

                    b.Property<long>("EmpresaID")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("ClienteID");

                    b.HasIndex("EmpresaID");

                    b.ToTable("ClienteEmpresa");
                });

            modelBuilder.Entity("teste_tria.Models.Empresa", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<string>("CNPJ")
                        .IsRequired()
                        .HasColumnType("varchar(14) CHARACTER SET utf8mb4")
                        .HasMaxLength(14);

                    b.Property<string>("RazaoSocial")
                        .IsRequired()
                        .HasColumnType("varchar(150) CHARACTER SET utf8mb4")
                        .HasMaxLength(150);

                    b.HasKey("Id");

                    b.ToTable("Empresas");
                });

            modelBuilder.Entity("teste_tria.Models.ClienteEmpresa", b =>
                {
                    b.HasOne("teste_tria.Models.Cliente", "Cliente")
                        .WithMany("ClienteEmpresas")
                        .HasForeignKey("ClienteID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("teste_tria.Models.Empresa", "Empresa")
                        .WithMany("ClienteEmpresas")
                        .HasForeignKey("EmpresaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
