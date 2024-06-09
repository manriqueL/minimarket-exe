import { useState, useEffect } from "react";
import { useNavigate } from "react-router";


function Proveedores() {

const navigate = useNavigate()
const token = localStorage.getItem('token')
const [proveedor, setProveedor] = useState({
    nombre: "",
    direccion: "",
    telefono: 0,
    mail: "",
    id_proveedor: 0
})
const [proveedores, setProveedores] = useState([])
const [visible, setVisible] = useState(false)
const [proveedorSeleccionado, setProveedorSeleccionado] = useState({})


useEffect(() => {
    fetch("http://localhost:3000/proveedores",{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}` 
      }
    })
      .then((res) => res.json())
      .then((proveedores) => setProveedores(proveedores));
      
  }, []);

  useEffect(() => {
    !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
  }, []);

  const clickProveedor = async (proveedor) => {
    setProveedorSeleccionado(proveedor.id_proveedor)
    setProveedor(proveedor)
    setVisible(true)
  };



  function mensajeError(){
    let mensaje = "Ha ocurrido un error"
    proveedor.nombre == '' ? mensaje = mensaje + "\nNombre vacio" : null
    proveedor.direccion == '' ? mensaje = mensaje + "\nDireccion vacia" : null
    proveedor.telefono == "" ? mensaje = mensaje + "\nTelefono vacio" : null
    proveedor.mail == '' ? mensaje = mensaje + "\nMail vacio" : null
    return mensaje 
  }
  

    const agregarProveedor = async () => {
    const res = await fetch("http://localhost:3000/proveedores", {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        proveedor: {
          nombre: proveedor.nombre,
          direccion: proveedor.direccion,
          telefono: +proveedor.telefono,
          mail: proveedor.mail,
        }
      }),
    });

    if (res.ok) {
      const proveedorNuevo = await res.json();
      setProveedores([...proveedores, proveedorNuevo]);
    } else {
      alert(mensajeError())
    }
    limpiarForm()
    setVisible(false)
}

  //   const clickProveedor = async (proveedor) => {
  //   if (proveedor && proveedor.id_proveedor) {
  //     setProveedorSeleccionado(proveedor.id_proveedor);
  //     setProveedor({
  //       nombre: proveedor.nombre,
  //       direccion: proveedor.direccion,
  //       telefono: +proveedor.telefono,
  //       mail: proveedor.mail,
  //     });
  //     setVisible(true);
  //   } else {
  //     console.error('El proveedor no tiene un id.');
  //   }
  // };



    const editarProveedor = async () => {
    if (window.confirm("¿Desea editar?")) {
      const res = await fetch(`http://localhost:3000/proveedores/${proveedorSeleccionado}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            proveedor: {
                nombre: proveedor.nombre,
                direccion: proveedor.direccion,
                telefono: +proveedor.telefono,
                mail: proveedor.mail
              }
        }),
      });
      if (res.ok) {
        setProveedores(
          proveedores.map((item) => item.id_proveedor == proveedorSeleccionado ? proveedor : item)
        );
        limpiarForm();
        setVisible(false);
      } else {
        alert(mensajeError());
      }
    }
  };
  
    const eliminarProveedor = async (proveedorId) => {
    if (window.confirm("¿Desea eliminar?")) {
      const res = await fetch(`http://localhost:3000/proveedores/${proveedorId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`},
      });

      if (res.ok) {
        setProveedores(proveedores.filter((proveedor) => proveedor.id_proveedor !== proveedorId));
      } else {
        alert("Fallo al quitar proveedor");
      }
    }
    limpiarForm()
    setVisible(false)
  };

  function limpiarForm() {
    setProveedor({
      nombre: "",
      direccion: "",
      telefono: 0,
      mail: ""
    })
    setVisible(false)
  }
  const cancelarEdicion = () => {
    limpiarForm();
    setVisible(false);
  };

  return (
    <>
   <main className="md:w-3/5  xl:w-4/5 px-5 py-10 bg-gray-200">
      <h2 className="text-3xl font-light text-center">Agregar proveedor</h2>
        <div className="flex flex-col mt-10 items-center">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                    <div id="formulario" className="bg-white p-3">
                      {/* Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" forhtml="nombre">Nombre:</label>
                            <input 
                                onChange={(e)=>{setProveedor({...proveedor, nombre: e.target.value})}}
                                value={proveedor.nombre}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                name="nombre"
                                type="text"
                                placeholder="Nombre"
                        
                              
                            />
                        </div>
                        {/* Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" forhtml="direccion">Direccion:</label>
                            <input 
                                onChange={(e)=>{setProveedor({...proveedor, direccion: e.target.value})}}
                                value={proveedor.direccion}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="direccion"
                                name="direccion"
                                type="text"
                                placeholder="Direccion"
                                
                             
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" forhtml="telefono">Telefono:</label>
                            <input 
                                onChange={(e)=>{setProveedor({...proveedor, telefono: e.target.value})}}
                                value={proveedor.telefono}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="telefono"
                                name="telefono"
                                type="int"
                                placeholder="Telefono"
                            />
                        </div>
                        

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" forhtml="mail">Mail:</label>
                            <input 
                                onChange={(e)=>{setProveedor({...proveedor, mail: e.target.value})}}
                                value={proveedor.mail}
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="mail"
                                name="mail"
                                type="text"
                                placeholder="Agregar mail"
                                
                            />
                        </div>
                        {visible ? (
                            <input
                              onClick={editarProveedor}
                              type="submit"
                              className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Editar Proveedor"
                            />
                          ) : (
                            <input
                              onClick={agregarProveedor}
                              type="submit"
                              className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Agregar Proveedor"
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

        <h2 className="text-3xl font-light text-center mt-20">Proveedores</h2>
      <div className="flex flex-col mt-10">
          <div className="py-2 overflow-x-auto">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
               <table className="min-w-full">
                    <thead className="bg-gray-100 " >
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                    Nombre
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                    Direccion
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                    Telefono
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                    Mail
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                    Acciones
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody id="listado-proveedores" className="bg-white">
              {proveedores.map((item, index)=>(
                                    <tr key={item.id_proveedor}>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            {item.nombre}
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            {item.direccion}
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            {item.telefono}
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            {item.mail}
                                        </th>
                                        
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            <span className="cursor-pointer" onClick={()=>{eliminarProveedor(item.id_proveedor)}}>🗑️</span>
                                            <span className="cursor-pointer" onClick={()=>{clickProveedor(item)}}>📝</span>
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

};

export default Proveedores