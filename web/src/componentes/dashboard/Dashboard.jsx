import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Dashboard() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const [venta, setVenta] = useState({
        nombre: '',
        cantidad: 0,
        descuento: 0,
        total: 0,
        id_cliente: 0
    })

    const [libros, setLibros] = useState([])
    const [detallesFiltrados, setDetallesFiltrados] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/libros", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.status == 401 ? volverLogin() : res.json())
            .then((libros) => {
                setLibros(libros)
                setDetallesFiltrados(libros)
            });
    }, []);


    useEffect(() => {
        !localStorage.getItem("token") ? volverLogin() : null
    }, []);


    const volverLogin = () => {
        navigate('/login', { replace: true })
    }


    function filtrarLibro(nombre) {
        const libroFiltrado = libros.filter((item) => item.nombre.includes(nombre))
        setDetallesFiltrados(libroFiltrado)
    }

    return (
        <>
            <main className="md:w-3/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <h2 className="text-3xl font-light text-center">Listado de Libros</h2>
                <div className="flex flex-col mt-10 items-center">
                    <div className="w-full">
                        <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                            <div id="formulario" className="bg-white p-3 h-full">
                                <br></br>

                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nombre">Buscar Libro🔍</label>
                                    <input
                                        onChange={(e) => { setVenta({ ...venta, nombre: e.target.value }); filtrarLibro(e.target.value) }}
                                        value={venta.nombre}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Nombre"
                                        name="Nombre"
                                        type="text"
                                        placeholder="Ingresar nombre del libro"
                                    />

                                </div>
                                {/* Input */}
                                <div className="overflow-hidden overflow-y-scroll h-full" >
                                    {
                                        detallesFiltrados.map((item) => (
                                            <ul key={item.id_libro} >
                                                <li className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                    {item.nombre} - ${item.precio} (En Stock: {item.stock - item.ventas})
                                                </li>
                                            </ul>
                                        ))}
                                </div>
                                <br></br>
                            </div>
                        </div>
                    </div>
                </div>


            </main>
        </>
    )
}

export default Dashboard
