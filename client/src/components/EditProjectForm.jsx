import { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { GET_PROJECTS } from '../queries/projectQueries';
import { UPDATE_PROJECT } from '../mutations/projectMutations';

const STATUS = {
  'Not Started': 'new',
  'In Progress': 'progress',
  Completed: 'completed',
};

const EditProjectForm = ({ project }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(STATUS[project.status]);

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { id: project.id, name, description, status },
    refetchQueries: [{ query: GET_PROJECTS, variables: { id: project.id } }],
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !status) {
      return alert('Please fill in all fields');
    }

    updateProject(name, description, status);
  };

  return (
    <>
      <div className='d-flex mt-5 ms-auto'>
        <button
          type='button'
          className='btn btn-secondary m-2'
          data-bs-toggle='modal'
          data-bs-target='#updateProjectModal'
        >
          <FaPen className='icon' />
          Update Project
        </button>
      </div>

      <div
        className='modal fade'
        id='updateProjectModal'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabel'>
                Update Project
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>

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

                <button
                  className='btn btn-secondary'
                  type='submit'
                  data-bs-dismiss='modal'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProjectForm;
