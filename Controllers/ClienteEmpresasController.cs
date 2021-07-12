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
    public class ClienteEmpresasController : ControllerBase
    {
        private readonly Context _context;

        public ClienteEmpresasController(Context context)
        {
            _context = context;
        }

        // GET: api/ClienteEmpresas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClienteEmpresa>>> GetClienteEmpresa()
        {
            return await _context.ClienteEmpresa.ToListAsync();
        }

        // GET: api/ClienteEmpresas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteEmpresa>> GetClienteEmpresa(long id)
        {
            var clienteEmpresa = await _context.ClienteEmpresa.FindAsync(id);

            if (clienteEmpresa == null)
            {
                return NotFound();
            }

            return clienteEmpresa;
        }

        // PUT: api/ClienteEmpresas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClienteEmpresa(long id, ClienteEmpresa clienteEmpresa)
        {
            if (id != clienteEmpresa.Id)
            {
                return BadRequest();
            }

            _context.Entry(clienteEmpresa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteEmpresaExists(id))
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

        // POST: api/ClienteEmpresas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ClienteEmpresa>> PostClienteEmpresa(ClienteEmpresa clienteEmpresa)
        {
            _context.ClienteEmpresa.Add(clienteEmpresa);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClienteEmpresa", new { id = clienteEmpresa.Id }, clienteEmpresa);
        }

        // DELETE: api/ClienteEmpresas/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ClienteEmpresa>> DeleteClienteEmpresa(long id)
        {
            var clienteEmpresa = await _context.ClienteEmpresa.FindAsync(id);
            if (clienteEmpresa == null)
            {
                return NotFound();
            }

            _context.ClienteEmpresa.Remove(clienteEmpresa);
            await _context.SaveChangesAsync();

            return clienteEmpresa;
        }

        private bool ClienteEmpresaExists(long id)
        {
            return _context.ClienteEmpresa.Any(e => e.Id == id);
        }
    }
}
