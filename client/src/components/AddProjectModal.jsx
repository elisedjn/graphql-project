import { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PROJECT } from '../mutations/projectMutations';
import { GET_PROJECTS } from '../queries/projectQueries';
import { GET_CLIENTS } from '../queries/clientQueries';
import Spinner from './Spinner';

const AddProjectModal = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState('new');

  const { loading, error, data } = useQuery(GET_CLIENTS);

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, status, clientId },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
      });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !status || !clientId) {
      return alert('Please fill in all fields');
    }

    addProject(name, description, status, clientId);

    setName('');
    setDescription('');
    setClientId('');
    setStatus('new');
  };

  return (
    <>
      <button
        type='button'
        className='btn btn-primary'
        data-bs-toggle='modal'
        data-bs-target='#addProjectModal'
      >
        <div className='d-flex align-items-center'>
          <FaList className='icon' />
          <div>New Project</div>
        </div>
      </button>

      <div
        className='modal fade'
        id='addProjectModal'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabel'>
                New Project
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            {loading ? (
              <Spinner />
            ) : error ? (
              <p>Something went wrong...</p>
            ) : (
              <div className='modal-body'>
                <form onSubmit={onSubmit}>
                  <div className='mb-3'>
                    <label className='form-label'>Name</label>
                    <input
                      className='form-control'
                      type='text'
                      id='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea
                      className='form-control'
                      id='description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className='mb-3'>
                    <label className='form-label'>Status</label>
                    <select
                      className='form-select'
                      id='status'
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value='new'>Not Started</option>
                      <option value='progress'>In Progress</option>
                      <option value='completed'>Completed</option>
                    </select>
                  </div>
                  <div className='mb-3'>
                    <label className='form-label'>Client</label>
                    <select
                      className='form-select'
                      id='clientId'
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    >
                      {data.clients.length ? (
                        data.clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Create a client first</option>
                      )}
                    </select>
                  </div>

                  <button
                    className='btn btn-primary'
                    type='submit'
                    data-bs-dismiss='modal'
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProjectModal;
