/**
 * @jest-environment jsdom
 */

import mockStore from "../__mocks__/store"
import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { formatDate, formatStatus } from "../app/format.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";

jest.mock("../app/Store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeEach(() => {
      const localBills = JSON.parse(JSON.stringify(bills))
      document.body.innerHTML = BillsUI({ data: localBills })
    })
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const datesExpected = bills.map(bill => bill.date)
      const datesSorted = datesExpected.sort((a,b) => new Date(b) - new Date(a)).map(date => formatDate(date))
      const dates = screen.getAllByTestId('bill-date').map(date => date.textContent)
      expect(dates).toEqual(datesSorted)
    })
    describe("When I click on new Bill", () => {
      test("I am redirect to new bill page", () => {
        const newBillButton = screen.getByTestId('btn-new-bill')
        const onNavigate = jest.fn((pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        })
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const billsPage = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
        const handleClickNewBill = jest.fn((e) => billsPage.handleClickNewBill())
        newBillButton.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillButton)
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill'])
        expect(handleClickNewBill).toHaveBeenCalled()
      })
    })
    describe("When I click on iconEye icon", () => {
      test("Then I should see bill's image", () => {
        $.fn.modal = jest.fn()
        const iconEye = screen.getAllByTestId('icon-eye')[0]
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const billsPage = new Bills({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })
        const handleClickIconEye = jest.fn((e) => billsPage.handleClickIconEye( iconEye ))
        iconEye.addEventListener('click', handleClickIconEye(iconEye))
        userEvent.click(iconEye)
        expect(handleClickIconEye).toHaveBeenCalled()
      })
    })
    test("Then I should see my bills", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      bills.forEach(bill => {
        bill.status = formatStatus(bill.status)
      })
      const billsPage = new Bills({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })
      expect(screen.getByTestId('tbody').querySelectorAll('tr').length).toEqual(bills.length)
    })
  }),
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
 