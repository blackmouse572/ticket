import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { TbEditCircle, TbTrashXFilled } from "react-icons/tb";
import { Employee } from "../../entity/Employee";
import appfetch from "../../lib/axios";
import { queryClient } from "../../main";

type Props = {};

function EmployeePage({}: Props) {
  const [seletedEmployee, setSeletedEmployee] = React.useState<Employee>();
  const { data: employees, isLoading, isError } = useQuery(["employee"], getEmployees);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  function selectEmployee(employee: Employee) {
    setSeletedEmployee(employee);
    setIsDialogOpen(true);
  }
  function addEmployee() {
    setSeletedEmployee(undefined);
    setIsDialogOpen(true);
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold leading-tight">Employees</h3>
      <button className="btn btn-info btn-square" onClick={addEmployee}>
        +
      </button>
      <div className="overflow-y-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
            {employees &&
              employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td className="border border-base-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-base-300 px-4 py-2">{employee.name}</td>
                  <td className="border border-base-300 px-4 py-2">{employee.email}</td>
                  <td className="border border-base-300 px-4 py-2">{employee.phoneNumber}</td>
                  <td className="border border-base-300 px-4 py-2">{employee.address}</td>
                  <td className="border border-base-300 px-4 py-2">
                    <button
                      className="btn btn-primary btn-circle btn-ghost text-primary hover:text-white hover:bg-primary text-xl"
                      onClick={() => selectEmployee(employee)}
                    >
                      <EmployeeDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} employee={seletedEmployee}>
                        <TbEditCircle />
                      </EmployeeDialog>
                    </button>
                    <button className="btn btn-error hover:bg-error text-error hover:text-white btn-circle btn-ghost text-xl">
                      <TbTrashXFilled />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
type EmployeeDialogProps = {
  employee?: Employee;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  children?: React.ReactNode;
};

export function EmployeeDialog({ employee, isOpen, children: trigger, onOpenChange }: EmployeeDialogProps) {
  const mutate = useMutation((data: any) => appfetch.post("/Employees", data), {
    onSuccess: (data) => {
      queryClient.setQueryData(["employee"], (oldData: any) => {
        if (employee) {
          return oldData.map((item: any) => (item.id === employee.id ? data : item));
        } else {
          return [...oldData, data];
        }
      });
    },
  });
  const updateEmployee = useMutation((data: any) => appfetch.put(`/Employees/${employee?.id}`, data), {
    onSuccess: (data) => {
      queryClient.setQueryData(["employee"], (oldData: any) => {
        if (employee) {
          return oldData.map((item: any) => (item.id === employee.id ? data : item));
        } else {
          return [...oldData, data];
        }
      });
    },
  });
  function onSubmit(e: any) {
    e.preventDefault();
    const name = e.currentTarget.name.value;
    const cid = e.currentTarget.cid.value;
    const dob = e.currentTarget.dob.value;
    const email = e.currentTarget.email.value;
    const phoneNumber = e.currentTarget.phoneNumber.value;
    const address = e.currentTarget.address.value;
    const position = e.currentTarget.position.value;
    const startDate = new Date();

    const data = {
      cid,
      name,
      dob,
      email,
      phoneNumber,
      address,
      position,
      startDate,
    };
    if (employee) {
      console.log("...Updating employee", employee.id, " with data: ", data);
      updateEmployee.mutate(data);
    } else {
      console.log("...Adding employee with data: ", data);
      mutate.mutate(data);
    }
  }
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-base-300/50" />
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.DialogPortal>
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh]  max-w-[50vw] translate-x-[-50%] translate-y-[-50%] rounded-md bg-base-100 px-4 py-2 focus:outline-none">
          <Dialog.Title className="text-xl font-bold text-base-content">
            {employee ? "Edit Employee" : "Add Employee"}
          </Dialog.Title>
          <Dialog.Description className="text-sm font-medium text-base-300">
            Click outside the dialog or press the Escape key to close it.
          </Dialog.Description>
          <form onSubmit={onSubmit} className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">Name</span>
            </label>
            <input
              id={"name"}
              type="text"
              placeholder="Name"
              className="input input-bordered"
              name={"name"}
              required
              defaultValue={employee?.name}
            />

            <div className="flex justify-between gap-5">
              <div>
                <label className="label" htmlFor="cid">
                  <span className="label-text">CCCD</span>
                </label>
                <input
                  id={"cid"}
                  type="text"
                  placeholder=""
                  className="input input-bordered"
                  name="cid"
                  required
                  defaultValue={employee?.cid}
                />
              </div>

              <div>
                <label className="label" htmlFor="position">
                  <span className="label-text">Vị trí</span>
                </label>
                <input
                  id={"position"}
                  type="text"
                  placeholder=""
                  className="input input-bordered"
                  name="position"
                  required
                  defaultValue={employee?.position}
                />
              </div>
            </div>

            <div className="flex justify-between gap-5">
              <div>
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  id={"email"}
                  type="text"
                  placeholder="Email"
                  className="input input-bordered"
                  name="email"
                  defaultValue={employee?.email}
                />
              </div>

              <div>
                <label className="label" htmlFor="phone">
                  <span className="label-text">Số điện thoại</span>
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="input input-bordered"
                  id={"phoneNumber"}
                  required
                  name="phoneNumber"
                  defaultValue={employee?.phoneNumber}
                />
              </div>
            </div>

            <label className="label" htmlFor="dob">
              <span className="label-text">Ngày sinh</span>
            </label>
            <input
              type="date"
              placeholder="--/--/----"
              className="input input-bordered"
              id={"dob"}
              name="dob"
              required
            />

            <label htmlFor="address" className="label">
              <span className="label-text">Địa chỉ</span>
            </label>
            <textarea
              id={"address"}
              placeholder="Address"
              className="textarea h-24 textarea-bordered"
              name="address"
              defaultValue={employee?.address}
              required
            />

            <div className="mt-4 flex gap-5">
              <button className="btn btn-primary">Save</button>
              <button className="btn btn-error btn-ghost">Cancel</button>
            </div>
          </form>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.DialogPortal>
    </Dialog.Root>
  );
}

export default EmployeePage;

//Loader
export async function getEmployees() {
  const res = await appfetch<Employee[]>("/Employees");
  return res.data;
}
