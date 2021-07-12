using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using teste_tria.Models;

namespace teste_tria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly Context _context;

        public ClientesController(Context context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();            
        }

        //GET: api/Clientes/Search/CPF/5
        //GET: api/Clientes/Search/Nome/A
        [HttpGet("Search/CPF/{cpf}")]
        [HttpGet("Search/Nome/{nome}")]
        public async Task<ActionResult<IEnumerable<Cliente>>> SearchClientes([FromRoute]string cpf, [FromRoute]string nome)
        {
            if (!(cpf == null && nome == null)){
                if (cpf != null){
                    return await _context.Clientes.Where(cliente => cliente.CPF.StartsWith(cpf)).ToListAsync();
                }else{
                    return await _context.Clientes.Where(cliente => cliente.Nome.StartsWith(nome)).ToListAsync();
                }
            }else{
                return BadRequest();
            }
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(long id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }        

        // PUT: api/Clientes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(long id, Cliente cliente)
        {
            if (id != cliente.Id)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Clientes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(ApiCliente apicliente)
        {
            Cliente cliente = new Cliente{
                Id = apicliente.Id,
                CPF = apicliente.CPF,
                Nome = apicliente.Nome,
                Email= apicliente.Email,
                DtCriacao = DateTime.Now
            };
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCliente", new { id = cliente.Id }, cliente);
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Cliente>> DeleteCliente(long id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return cliente;
        }

        private bool ClienteExists(long id)
        {
            return _context.Clientes.Any(e => e.Id == id);
        }
    }
}
