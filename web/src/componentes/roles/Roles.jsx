import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

function Roles() {
    
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    const [rol,setRol] = useState({
        nombre : ''
    })

    const [roles, setRoles] = useState([]);
    const [rolSeleccionada, setRolSeleccionada] = useState({})
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/roles",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((roles) => setRoles(roles));
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
  
    const clickRol = async (rol) => {
      setRolSeleccionada(rol.id_rol)
      setRol(rol)
      setVisible(true)
    };

    function mensajeError(){
      let mensaje = "Ha ocurrido un error"
      rol.nombre == '' ? mensaje = mensaje + "\nNombre vacio" : null
      return mensaje 
    }
    
    
  
    const eliminarRol = async (rolId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/roles/${rolId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setRoles(roles.filter((rol) => rol.id_rol !== rolId));
        } else {
          alert("Fallo al quitar rol");
        }
      }
      limpiarForm()
      setVisible(false)
    };
  
    const agregarRol = async () => {
      const res = await fetch("http://localhost:3000/roles", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
        
            nombre: rol.nombre,
          
        }),
      });
  
      if (res.ok) {
        const rolNueva = await res.json();
        fetch("http://localhost:3000/roles",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((roles) => setRoles(roles));
      } else {
        alert(mensajeError())
      }
      limpiarForm()
      setVisible(false)
    };
  
    const edicionRol = async () => {
      if (window.confirm("¿Desea Editar ?")) {
        const res = await fetch(`http://localhost:3000/roles/${rolSeleccionada}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
           
              nombre: rol.nombre
            
          }),
        });
        if (res.ok) {
          setRoles(
            roles.map((item)=> item.id_rol == rolSeleccionada?rol:item)
          )
          limpiarForm()
          setVisible(false)
        } else {
          alert("Error al editar la rol.");
        }
      }
  
    }
  
    const cancelarEdicion = () => {
      limpiarForm();
      setVisible(false);
    };
  
    
    function limpiarForm() {
      setRol({
        nombre: ''
      })
      setVisible(false)
    }

    return (
        <>
            <main className="md:w-3/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <h2 className="text-3xl font-light text-center">Agregar Rol</h2>
                <div className="flex flex-col mt-10 items-center">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                        <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                            <div id="formulario" className="bg-white p-3">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nombre">Nombre</label>
                                    <input
                                        onChange={(e)=>{setRol({...rol, nombre: e.target.value})}}
                                        value={rol.nombre}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Nombre"
                                        name="Nombre"
                                        type="text"
                                        placeholder="Ingresar nombre del rol"
                                    />
                                </div>
                                {visible ? (
                                    <input
                                      onClick={edicionRol}
                                      type="submit"
                                      className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                                      value="Editar Rol"
                                    />
                                  ) : (
                                    <input
                                      onClick={agregarRol}
                                      type="submit"
                                      className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                                      value="Agregar Rol"
                                    />
                                  )}
                                    {visible && (
                                    <input
                                      type="submit"
                                      onClick={cancelarEdicion}
                                      className="bg-gray-500 hover:bg-gray-700 text-white w-full mt-5 p-2 uppercase font-bold"
                                      value="Cancelar"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-light text-center mt-20">Listado de Roles</h2>
                <div className="flex flex-col mt-10">
                    <div className="py-2 overflow-x-auto">
                        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                {/* Inicio del Listado */}
                                <tbody id="listado-Roles" className="bg-white">
                                    {/* Inicio del Item del Listado */}
                                    {
                                    roles.map((item,index)=>(
                                        <tr key={item.id_rol}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.nombre}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span className="cursor-pointer"  onClick={()=>{eliminarRol(item.id_rol)}}>🗑️</span>
                                                <span className="cursor-pointer" onClick={()=>{clickRol(item)}}>📝</span>
                                            </th>
                                        </tr>
                                     ))}
                                    {/* Fin del Item del Listado */}
                                </tbody>
                                {/* Fin del Listado */}
                            </table>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}

export default Roles
