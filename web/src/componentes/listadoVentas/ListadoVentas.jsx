import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

function ListadoVentas() {
    
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    const [venta,setVenta] = useState({
        nombre : '',
        fecha_alta:'',
        cliente: '',
        vendedor: '',
        descuento: 0,
        total: 0,
        libros: []
    })

    const [ventas, setListadoVentas] = useState([]);
    const [ventasFiltradas, setVentasFiltradas]=useState([])
  
    useEffect(() => {
      fetch("http://localhost:3000/ventas",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((ventas) =>  { 
          setListadoVentas(ventas) 
          setVentasFiltradas(ventas)
        });
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
    
    function filtrarVenta(fecha) {
      const ventasFiltrado = ventas.filter((item)=>item.ventas.fecha_alta.includes(fecha))
      setVentasFiltradas(ventasFiltrado)
    }


    function verVenta(item) {
      fetch(`http://localhost:3000/ventas-productos/${item.ventas.id_venta}`,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((libros) =>  { 
          setVenta({...libros,
            descuento: item.ventas.descuento,
            cliente: item.cliente.nombre + " " + item.cliente.apellido,
            vendedor: item.vendedor.nombre + " " + item.vendedor.apellido,
            fecha_alta: item.ventas.fecha_alta.slice(0,10),
            total: libros.reduce((acc,item)=> acc + (item.cantidad * item.precio),0),
            libros: libros
          })
          console.log(item);
        });
    }

    const anularVenta = async (item) => {
      if (window.confirm("¿Desea Anular la Venta?")) {
        const res = await fetch(`http://localhost:3000/ventas/${item.ventas.id_venta}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            ventas: { 
              anulado: 1
            },
          }),
        });
        if (res.ok) {
          alert("Se anuló la venta")
          fetch("http://localhost:3000/ventas",{
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}` 
              }
      })
        .then((res) => res.json())
        .then((ventas) =>  { 
          setListadoVentas(ventas) 
          setVentasFiltradas(ventas)
        });
        
        } else {
          alert("Error al anular la venta");
        }
      }
    }

    return (
        <>
              <main className="md:w-2/5  xl:w-4/5 px-5 py-10 bg-gray-200">
              <div className="flex flex-row items-start">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                    <h2 className="text-3xl font-light text-center">Detalle de la Venta </h2>
                    <br></br>
                        <div className=" bg-white p-3 shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="Username">Fecha</label>
                                    {venta.fecha_alta.slice(0,10)}
                                    <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="Username">Cliente</label>
                                    {venta.cliente}
                                    <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="Password">Vendedor</label>
                                    {venta.vendedor}
                                    <label className="block text-gray-700 text-sm font-bold mt-2" htmlFor="Tipo">Descuento</label>
                                    {venta.descuento}%
                                    <label className="block text-gray-700 text-sm font-bold mt-5" htmlFor="Tipo">Libros</label>
                                    <ul>
                                    {
                                    venta.libros.map((item)=>(
                                      <li className="mt-2">
                                        <b>{item.libro.nombre}</b> ({item.cantidad} x  ${item.precio})
                                       </li>
                                     ))}
                                    </ul>
                                    <label className="block text-gray-700 text-sm font-bold mt-10" htmlFor="Tipo">Total</label>
                                    <b>${venta.total}</b>
                                    <label className="block text-gray-700 text-sm font-bold mt-10" htmlFor="Tipo">Total con Descuento</label>
                                    <b>${venta.total-(venta.total*venta.descuento/100)}</b>
                                </div>
                        </div>
                    </div>
                    <div className="py-2  w-full ml-5 t-0 -mt-12">
                      <h2 className="text-3xl font-light text-center mt-20">Listado de Ventas</h2>

                      <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nombre">Buscar Venta por Fecha 🔍</label>
                                    <input
                                        onChange={(e)=>{setVenta({...venta,fecha_alta:e.target.value});filtrarVenta(e.target.value)}}
                                        value={venta.fecha_alta}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="fecha"
                                        name="fecha"
                                        type="text"
                                        placeholder="Ingresar fecha de la venta"
                                    />
                                
                                </div>
                                {/* Input */}
                                <div className="overflow-hidden overflow-y-scroll h-30" >
                                <table className="min-w-full">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 pr-20 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Vendedor
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Anulado
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="listado-ListadoVentas" className="bg-white">
                                {
                                    ventasFiltradas.map((item)=>(
                                      <tr key={item.id_venta}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.ventas.fecha_alta.slice(0,10)}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.vendedor.nombre} {item.vendedor.apellido}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.cliente.nombre} {item.cliente.apellido}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                { item.ventas.anulado == 1 && ("Si") }
                                                { item.ventas.anulado == 0 && ("No") }
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                { item.ventas.anulado == 0 && ( <span className="cursor-pointer mr-5" onClick={()=>{anularVenta(item)}}>❌</span>)}
                                                <span  className="cursor-pointer" onClick={()=>{verVenta(item)}}>👁️</span>
                                            </th>
                                        </tr>
                                     ))}
                                  </tbody>
                                  </table>
                                </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ListadoVentas
