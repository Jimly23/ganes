<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserAdminController extends Controller
{
    public function index()
    {
        $admins = UserAdmin::all();
        return response()->json([
            'status' => 'success',
            'data' => $admins
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:user_admins',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $admin = UserAdmin::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User admin created successfully',
            'data' => $admin
        ], 201);
    }

    public function show(string $id)
    {
        $admin = UserAdmin::find($id);

        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'User admin not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $admin
        ]);
    }

    public function update(Request $request, string $id)
    {
        $admin = UserAdmin::find($id);

        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'User admin not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:user_admins,email,'.$id,
            'password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $data = $request->except('password');

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $admin->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'User admin updated successfully',
            'data' => $admin
        ]);
    }

    public function destroy(string $id)
    {
        $admin = UserAdmin::find($id);

        if (!$admin) {
            return response()->json(['status' => 'error', 'message' => 'User admin not found'], 404);
        }

        $admin->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User admin deleted successfully'
        ]);
    }
}
