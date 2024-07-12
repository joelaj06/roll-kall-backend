const axios = require("axios");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const luxon = require("luxon");
const { options } = require("pdfkit");
const { DateTime } = luxon;

const createPDF = (title, data = [], dataCallback, endCallback) => {
  const doc = new PDFDocument();
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.fontSize(25).text(title, { align: "center" });

  doc.fontSize(12);
  data.forEach((item) => {
    doc.text(JSON.stringify(item, null, 2));
  });

  doc.end();
};

const dailyAttendanceReportPDF = async (
  title,
  date,
  data,
  organization,
  dataCallback,
  endCallback
) => {
  const doc = new PDFDocument({ margin: 30 });
  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Fetch and include the logo
  if (organization.logo) {
    const response = await axios.get(organization.logo, {
      responseType: "arraybuffer",
    });
    const logo = Buffer.from(response.data, "binary");
    doc.image(logo, { fit: [100, 100], align: "center" });
  }

  // Organization Information
  doc.fontSize(12).font("Times-Roman");
  doc.fontSize(14).text(organization.name, { align: "center" });
  doc.fontSize(12).text(organization.motto, { align: "center" });
  doc.fontSize(12).text(organization.address, { align: "center" });
  doc.moveDown(2);

  // Report Title
  doc.fontSize(14).text(title, { align: "center" });
  doc.moveDown(1);

  const table = {
    headers: [
      { label: "Name", property: "name", width: 100, renderer: null },
      { label: "Date", property: "date", width: 100, renderer: null },
      { label: "Check In", property: "check_in", width: 80, renderer: null },
      {
        label: "Check Out",
        property: "check_out",
        width: 80,
        renderer: null,
      },
      {
        label: "Working Hrs",
        property: "working_hrs",
        width: 100,
        renderer: null,
      },
      { label: "Location", property: "location", width: 100, renderer: null },
    ],
    datas: data.map((item) => {
      return {
        name: item.name,
        date: item.date,
        check_in: item.checkIn,
        check_out: item.checkOut,
        working_hrs: item.workingHours,
        location: item.location,
      };
    }),
  };

  doc.table(table, {
    prepareHeader: () => doc.font("Times-Roman").fontSize(10),
    prepareRow: (row, indexColumn, indexRow, rectRow) => {
      doc.font("Times-Roman").fontSize(10);
      indexColumn === 0 &&
        doc.addBackground(rectRow, indexRow % 2 ? "grey" : "white", 0.15);
    },
  });

  doc.end();
};

const attendanceSummaryReportPDF = async (
  title,
  data,
  organization,
  dataCallback,
  endCallback
) => {
  const doc = new PDFDocument({ margin: 30 });
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  // Fetch and include the logo
  if (organization.logo) {
    const response = await axios.get(organization.logo, {
      responseType: "arraybuffer",
    });
    const logo = Buffer.from(response.data, "binary");
    doc.image(logo, { fit: [100, 100], align: "center" });
  }

  // Organization Information
  doc.fontSize(12).font("Times-Roman");
  doc.fontSize(14).text(organization.name, { align: "center" });
  doc.fontSize(12).text(organization.motto, { align: "center" });
  doc.fontSize(12).text(organization.address, { align: "center" });
  doc.moveDown(2);

  // Report Title
  doc.fontSize(14).text(title, { align: "center" });
  doc.moveDown(1);

  const table = {
    headers: [
      { label: "Name", property: "name", width: 250, renderer: null },
      {
        label: "Total Check In",
        property: "totalCheckIns",
        width: 100,
        renderer: null,
      },
      {
        label: "Total Check Out",
        property: "totalCheckOuts",
        width: 100,
        renderer: null,
      },
      {
        label: "Total Leaves",
        property: "totalLeaves",
        width: 100,
        renderer: null,
      },
    ],
    datas: data.map((item) => {
      return {
        name: item.user,
        totalCheckIns: item.totalCheckIns,
        totalCheckOuts: item.totalCheckOuts,
        totalLeaves: item.totalLeaves,
      };
    }),
  };

  doc.table(table, {
    prepareHeader: () => doc.font("Times-Roman").fontSize(10),
    prepareRow: (row, indexColumn, indexRow, rectRow) => {
      doc.font("Times-Roman").fontSize(10);
      indexColumn === 0 &&
        doc.addBackground(rectRow, indexRow % 2 ? "grey" : "white", 0.15);
    },
  });

  doc.end();
};

const leaveManagementReportPDF = async (
  title,
  data,
  organization,
  dataCallback,
  endCallback
) => {
  const doc = new PDFDocument({ margin: 30 });
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  // Fetch and include the logo
  if (organization.logo) {
    const response = await axios.get(organization.logo, {
      responseType: "arraybuffer",
    });
    const logo = Buffer.from(response.data, "binary");
    doc.image(logo, { fit: [100, 100], align: "center" });
  }

  // Organization Information
  doc.fontSize(12).font("Times-Roman");
  doc.fontSize(14).text(organization.name, { align: "center" });
  doc.fontSize(12).text(organization.motto, { align: "center" });
  doc.fontSize(12).text(organization.address, { align: "center" });
  doc.moveDown(2);

  // Report Title
  doc.fontSize(14).text(title, { align: "center" });
  doc.moveDown(1);

  const table = {
    headers: [
      { label: "Name", property: "name", width: 250, renderer: null },
      {
        label: "From",
        property: "startDate",
        width: 100,
        renderer: null,
      },
      {
        label: "To",
        property: "endDate",
        width: 100,
        renderer: null,
      },
      {
        label: "Status",
        property: "status",
        width: 100,
        renderer: null,
      },
    ],
    datas: data.map((item) => {
      return {
        name: item.name,
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status,
      };
    }),
  };

  doc.table(table, {
    prepareHeader: () => doc.font("Times-Roman").fontSize(10),
    prepareRow: (row, indexColumn, indexRow, rectRow) => {
      doc.font("Times-Roman").fontSize(10);
      indexColumn === 0 &&
        doc.addBackground(rectRow, indexRow % 2 ? "grey" : "white", 0.15);
    },
  });

  doc.end();
};

module.exports = {
  createPDF,
  dailyAttendanceReportPDF,
  attendanceSummaryReportPDF,
  leaveManagementReportPDF,
};
